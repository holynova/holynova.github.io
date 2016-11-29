def letter2num(word):
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    word = word.lower()
    for letter in word:
        print letter.upper(), alphabet.find(letter)


word = 'searchxmpl'
letter2num(word)
