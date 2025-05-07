import urllib.parse
import requests
from PIL import Image, ImageFont, ImageDraw
from typing import Tuple, TypedDict, NotRequired
import os.path
import math
from io import BytesIO
import base64
import sys
import json


class Card(TypedDict):
    name: str
    quantity: str
    foil: bool
    price: NotRequired[float]

def encode_card_name(card_name: str) -> str:
    return urllib.parse.quote(card_name).replace("=", ":")

def fetch_card_data(card_name: str) -> dict:
    if card_name.startswith("="):
        query = card_name[1:]
        url = f"https://api.scryfall.com/cards/search?q={query}"
        response = requests.get(url, timeout=2)
        return response.json()['data'][0]
    else:
        return fetch_named_card(card_name)

def fetch_named_card(name: str) -> dict:
    base_url = "https://api.scryfall.com/cards/named?fuzzy="
    encoded_name = encode_card_name(name)
    response = requests.get(base_url + encoded_name, timeout=2)
    data = response.json()

    if data.get('lang') not in ('en', 'pt'):
        response = requests.get(base_url + encode_card_name(data['name']), timeout=2)
        data = response.json()
    
    return data

def extract_image_url(card_data: dict) -> str:
    if 'card_faces' in card_data and 'image_uris' not in card_data:
        card_data = card_data['card_faces'][0]
    return card_data['image_uris']['png']

def get_card_image(card_name: str, size: Tuple[int, int]) -> Image.Image:
    try:
        card_data = fetch_card_data(card_name)
        img_url = extract_image_url(card_data)

        with requests.get(img_url, timeout=2, stream=True) as img_response:
            img_response.raise_for_status()
            image = Image.open(img_response.raw)
            return image.resize(size)
    except Exception as e:
        raise RuntimeError(f"Erro ao obter imagem da carta '{card_name}': {e}")
    

def generate_want_image(card_list: list[Card], l: int = 5, card_size: tuple[int, int] = (745, 1040), ratio: float = 0.25):
    card_size = ( int(card_size[0] * ratio), int(card_size[1] * ratio) )
    ASSETS_PATH = os.path.join(__file__, "..", "..", "assets")
    FOIL_OVERLAY_PATH = os.path.join(ASSETS_PATH, "foil.png")
    FOIL_OVERLAY = Image.open(FOIL_OVERLAY_PATH).resize(card_size)

    FONT_PATH = os.path.join(ASSETS_PATH, "FiraSans-Book.ttf")
    FONT = ImageFont.truetype(FONT_PATH, int(card_size[0] / 2))
    FONT_SMALL = ImageFont.truetype(FONT_PATH, int(card_size[0] / 10))

    unique_cards = len(card_list)
    line_length = min(l, unique_cards)
    number_of_lines = math.ceil(unique_cards / line_length)
    
    image_size = (line_length * card_size[0], number_of_lines * card_size[1])

    im = Image.new(mode='RGB', size=image_size, color='white')
    draw = ImageDraw.Draw(im, "RGBA")

    row = 0
    col = 0

    for card in card_list:
        card_image = get_card_image(card['name'], card_size)
        card_position = (card_size[0] * col, card_size[1] * row)
        im.paste(card_image, card_position)
        if card.get('foil', False):
            im.paste(FOIL_OVERLAY, card_position, mask=FOIL_OVERLAY)
        
        if card.get('quantity'):
            text_width = draw.textlength(str(card['quantity']), font=FONT)
            text_height = FONT.size

            draw.text(
                xy=(
                    (card_size[0]/2 + (card_size[0] * col) - text_width / 2),  #(middle of the card + column + center text )
                    (card_size[1]/2 + (card_size[1] * row) - text_height / 2), #(middle of the card + row + center text )
                ),
                text=str(card['quantity']),
                font=FONT,
                stroke_width=math.ceil(16 * ratio),
                stroke_fill='black'
            )

        if card['price']:
            price_tag = f"R$ {card['price']}".replace(".", ",")

            text_width = draw.textlength(price_tag, font=FONT_SMALL)
            text_height = FONT_SMALL.size
            text_x = card_size[0]/2 + (card_size[0] * col) - text_width / 2            #(middle of the card + column + center text )
            text_y = card_size[1]-text_height + (card_size[1] * row) - text_height / 2 #(bottom of the card + row + center text )

            draw.rectangle(
                xy=[(text_x - card_size[0]/20, text_y - text_height/10), (text_x + text_width + card_size[0]/20, text_y + text_height * 1.5)],
                fill=(255,255,255,128)
            )
            draw.text(
                xy=(text_x, text_y),
                text=price_tag,
                font=FONT_SMALL,
                stroke_width=math.ceil(4 * ratio),
                stroke_fill='black'
            )
        
        if col== line_length-1:
            col = 0
            row += 1
        else:
            col +=1
        

    image_file = BytesIO()
    im.save(image_file, format="PNG")
    image_bytes = image_file.getvalue()
    image_b64 = base64.b64encode(image_bytes)
    return image_b64.decode('utf-8')


def main():
    raw_input = sys.stdin.read()
    json_input = json.loads(raw_input)
    card_list = json_input['cards']
    l = json_input.get('columns', 5)
    card_size = tuple(json_input.get('cardSize', [745, 1040]))
    ratio = json_input.get('ratio', 0.25)

    return_image = generate_want_image(card_list, l, card_size, ratio)

    print(json.dumps({
        "image": return_image
    }))

if __name__=="__main__":
    main()