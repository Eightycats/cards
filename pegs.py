def print_card(suit, rank):
    print(f"<img src=\"img/{suit}{rank}.png\">\n")

def print_suit(suit):
    for i in range(1, 10):
        print_card(suit, i)

    print_card(suit, "J")
    print_card(suit, "Q")
    print_card(suit, "K")
    print_card(suit, "A")

print_suit("H")
print_suit("S")
print_suit("D")
print_suit("C")
