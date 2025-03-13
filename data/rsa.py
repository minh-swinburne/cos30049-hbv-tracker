e = 7
n = 55

phi = 40
d = 1

while True:
    if (e * d) % phi == 1:
        break
    d += 1

print(d)
print(48 ** d % n)