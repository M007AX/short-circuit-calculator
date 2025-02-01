""" calculation_of_short_circuit_in_a_node.py """
import numpy as np

n = 0
for i in uzly:
    if n < i.nU: n = i.nU
n = n + 1
print('n = ', n)
YW = np.zeros((n, n))
for j in wetwy:
    YW[j.nN, j.nK] = 1 / j.react
    YW[j.nK, j.nN] = 1 / j.react
YU = np.zeros(n)
IU = np.zeros(n)
for i in uzly:
    s = str(type(i))
    s1 = 'Gen'
    if s1 in s:
        YU[i.nU] -= 1 / i.react
        IU[i.nU] = - i.eds / 1.732 * 1 / i.react
    s2 = 'Shunt_reactor'
    if s2 in s:
        provodimost = 1 / (i.react / (10^6)) + (10^6)
        YU[i.nU] -= provodimost

nkz = 3  # задаем узел с коротким замыканием
YU[nkz] -= 1000000  # проводимость в узле кз
IU[nkz] = 0  # втекающий ток в узле кз
print(' YU= \n', YU)  # проверяем содержимое матрицы YU
print(' IU= \n', IU)  # проверяем содержимое матрицы IU
u = 0
for i in YW:
    s2 = - i.sum()
    YW[u, u] = YU[u] + s2
    u = u + 1
print(' YW= \n', YW)  # проверяем содержимое матрицы YW
UU = np.linalg.solve(YW, IU)
print(' UU(nkz = ' + str(nkz) + ') = \n', UU)  # проверяем решение в режиме кз
Ikz = -UU[3] * YU[3]
for i in uzly:
    # в случае, если nkz - источник, необходима коррекция Ikz
    s = str(type(i))
    s1 = 'Gen'
    if s1 in s and i.nU == nkz:
        Ikz = Ikz + i.eds / 1.732 * 1 / i.react
print(' Ikz(nkz = ' + str(nkz) + ') =', Ikz, ' kA')  # результат расчета
