#coding = utf-8

RED = True


def left_rotate(h):
    x = h.right
    h.right = x.left
    x.left = h
    x.color = h.color
    h.color = RED
    x.N = h.N
    h.N = h.left.N + h.right.N + 1
    return x


def right_rotate(h):
    x = h.left
    h.left = x.right
    x.right = h
    x.color = h.color
    h.color = RED
    x.N = h.N
    h.N = h.left.N + h.right.N + 1
    return x
