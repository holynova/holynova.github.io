# coding=utf-8
import random
import re


class Node:

    def __init__(self, data=None, value=None):
        self.data = data
        self.value = value
        self.left = None
        self.right = None

    def compare(self, a, b):
        # 比较函数:
        # a<b,返回负数
        # a>b,返回正数
        # a=b,返回0
        #
        return a - b

    def insert(self, data, value):
        # print '#self.data =', self.data
        if self.data is None:
            self.data = data
            self.value = value
        else:
            if data < self.data:
                if self.left is None:
                    self.left = Node(data, value)
                else:
                    self.left.insert(data, value)
            elif data > self.data:
                if self.right is None:
                    self.right = Node(data, value)
                else:
                    self.right.insert(data, value)
            else:
                self.value = value
        # else:
        #     self.data = data

    def lookup(self, data, parent=None):
        if data < self.data:
            if self.left is None:
                return None, None
            else:
                return self.left.lookup(data, self)
        elif data > self.data:
            if self.right is None:
                return None, None
            else:
                return self.right.lookup(data, self)
        else:
            return self, parent

    def delete(self, data):
        node, parent = self.lookup(data)
        # print '#43 node = ', node.data, ' parent=', parent.data
        if node is None:
            # print data, 'not found'
            return None
        else:
            cnt_child = node.children_count()
            # print '#49 cnt_child=', cnt_child
            if cnt_child == 0:
                if parent:
                    if parent.left is node:
                        parent.left = None
                    else:
                        parent.right = None
                else:
                    # 没有parent,是根节点
                    # 根节点没有child,又要被删除,所以整个tree就都为空了
                    node.data = None
                    # self.left = None
                    # self.right = None
            elif cnt_child == 1:
                if node.left:
                    n = node.left
                else:
                    n = node.right

                if parent:
                    if parent.left is node:
                        parent.left = n
                    else:
                        parent.right = n
                else:
                    # 根节点处理, 只有一个child,那么这个child就成为新的根节点,要把所有的东西复制过去
                    node.data = n.data
                    node.left = n.left
                    node.right = n.right
            elif cnt_child == 2:
                son_left = node.left
                son_right = node.right
                # print '#81 node = ', node.data, 'left =', son_left.data, ' right = ', son_right.data
                # 随机选左侧处理(左节点先上,右节点接到左节点的max处)或右侧处理(右节点先上,左节点接到右节点的min处)
                if random.choice(['min', 'max']) == 'min':
                    # if 1:
                    son_right.min().left = son_left
                    son_priority = son_right
                    # print '84# son_priority = ', son_priority.data
                else:
                    son_left.max().right = son_right
                    son_priority = son_left

                if parent:
                    # print '90# parent = ', parent.data
                    if parent.left is node:
                        parent.left = son_priority
                    else:
                        parent.right = son_priority
                else:
                    # 根节点
                    node.data = son_priority.data
                    node.left = son_priority.left
                    node.right = son_priority.right

    def min(self):
        n = self
        while n.left:
            n = n.left
        return n

    def max(self):
        n = self
        while n.right:
            n = n.right
        return n

    def children_count(self):
        cnt = 0
        if self.left:
            cnt += 1
        if self.right:
            cnt += 1
        return cnt

    def print_tree(self):
        if self.left:
            self.left.print_tree()
        if self.data is not None:
            print "{%s:%s}" % (self.data, self.value)
        if self.right:
            self.right.print_tree()


# root = Node(8)
# root.insert(3)
# root.insert(10)
# root.insert(1)
# root.insert(6)
# root.insert(4)
# root.insert(7)
# root.insert(14)
# root.insert(13)

# node, parent = root.lookup(11)
# print node
# print parent
# print root.print_tree()
# root.delete(3)
# print root.print_tree()


def gen_rand_arr(arrSize=99, arrMin=0, arrMax=100):
    arr = []
    for i in range(arrSize):
        item = {}
        item['data'] = random.randrange(arrMin, arrMax + 1)
        item['value'] = 'I am ' + str(item['data'])
        arr.append(item)
    return arr
    # return [random.randrange(arrMin, arrMax + 1) for i in range(arrSize)]

# print gen_rand_arr()

arr = gen_rand_arr(10, 0, 20)
print arr
# for n in arr:
#     print n,
# print ''
# arr = [0, 8, 3, 10, 1, 6, 4, 7, 14, 13]
root = Node()
for item in arr:
    print 'insert ', item['data'], item['value']
    root.insert(item['data'], item['value'])
root.print_tree()
print '-' * 100


# 词频统计
twocity = """
It was the best of times, it was the worst of times,
it was the age of wisdom, it was the age of foolishness,
it was the epoch of belief, it was the epoch of incredulity,
it was the season of Light, it was the season of Darkness,
it was the spring of hope, it was the winter of despair,
we had everything before us, we had nothing before us,
we were all going direct to Heaven, we were all going direct
the other way--in short, the period was so far like the present
period, that some of its noisiest authorities insisted on its
being received, for good or for evil, in the superlative degree
of comparison only.
"""
twocity_arr = re.split(r'\W+', twocity)
freq_tree = Node()
for key in twocity_arr:
    key = key.lower()
    node, parent = freq_tree.lookup(key)
    if node is None:
        freq_tree.insert(key, 1)
    else:
        freq_tree.insert(key, node.value + 1)

freq_tree.print_tree()
