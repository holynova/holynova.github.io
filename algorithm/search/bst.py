# coding=utf-8
import random


class Node:

    def __init__(self, data=None):
        self.data = data
        self.left = None
        self.right = None

    def insert(self, data):
        if self.data:
            if data < self.data:
                if self.left is None:
                    self.left = Node(data)
                else:
                    self.left.insert(data)
            elif data > self.data:
                if self.right is None:
                    self.right = Node(data)
                else:
                    self.right.insert(data)
        else:
            self.data = data

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
        if node is None:
            return None
        else:
            cnt_child = node.children_count()
            if cnt_child == 0:
                if parent:
                    if parent.left is node:
                        parent.left = None
                    else:
                        parent.right = None
                else:
                    # 没有parent,是根节点
                    # 根节点没有child,又要被删除,所以整个tree就都为空了
                    self.data = None
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
                    self.data = n.data
                    self.left = n.left
                    self.right = n.right
            elif cnt_child == 2:
                son_left = self.left
                son_right = self.right
                # 随机选左侧处理(左节点先上,右节点接到左节点的max处)或右侧处理(右节点先上,左节点接到右节点的min处)
                if random.choice(['min', 'max']) == 'min':
                    son_right.min().left = son_left
                    son_priority = son_right
                else:
                    son_left.max().right = son_right
                    son_priority = son_left

                if parent:
                    if parent.left is node:
                        parent.left = son_priority
                    else:
                        parent.right = son_priority
                else:
                    # 根节点
                    self.data = son_priority.data
                    self.left = son_priority.left
                    self.right = son_priority.right

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
        print self.data,
        if self.right:
            self.right.print_tree()


root = Node(8)
root.insert(3)
root.insert(10)
root.insert(1)
root.insert(6)
root.insert(4)
root.insert(7)
root.insert(14)
root.insert(13)
root.insert(6)
root.insert(4)
root.insert(7)
root.insert(14)
root.insert(13)
# node, parent = root.lookup(11)
# print node
# print parent
print root.print_tree()


def gen_rand_arr(arrSize=99, arrMin=0, arrMax=100):
    return [random.randrange(arrMin, arrMax + 1) for i in range(arrSize)]

# print gen_rand_arr()

arr = gen_rand_arr(20, 0, 999)
for n in arr:
    print n,
print ''

root = Node()
for data in arr:
    root.insert(data)
root.print_tree()
print '-' * 100

# for n in arr:
#     print 'del :' + str(n) + '---',
#     root.delete(n)
#     root.print_tree()
#     print 'insert:' + str(n) + '+++',
#     root.insert(n)
#     root.print_tree()

for n in arr:
    node, parent = root.lookup(n)
    print 'lookup:', str(n), '=', node.data
