def generate_suit_section(suit_code, suit_name):
    ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    section = []
    section.append(f'  <div class="suit-section">')
    section.append(f'    <div class="suit-title">{suit_name}</div>')
    section.append(f'    <div class="card-grid">')
    for rank in ranks:
        filename = f"{suit_code}{rank}.webp"
        section.append(f'      <img src="img/{filename}" alt="{suit_code}{rank}">')
    section.append(f'    </div>')
    section.append(f'  </div>\n')
    return '\n'.join(section)


def generate_full_html():
    suits = {
        'C': '♣ Clubs',
        'D': '♦ Diamonds',
        'H': '♥ Hearts',
        'S': '♠ Spades'
    }

    html = []

    # HTML head and CSS
    html.append("""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Playing Cards Grid</title>
  <style>
    body {
      font-family: sans-serif;
      background: #f0f0f0;
      margin: 2rem;
    }

    .suit-section {
      margin-bottom: 3rem;
    }

    .suit-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
    }

    .card-grid img {
      width: 100%;
      max-width: 120px;
      height: auto;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
""")

    # Add card sections by suit
    for code, name in suits.items():
        html.append(generate_suit_section(code, name))

    # Close body and html
    html.append("</body>\n</html>")

    # Combine and return full HTML
    return '\n'.join(html)


# Write the output to an HTML file
if __name__ == "__main__":
    with open("cards.html", "w", encoding="utf-8") as f:
        f.write(generate_full_html())

