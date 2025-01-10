import matplotlib.pyplot as plt
import sys

def simultaneous_equation_cannon(total_cards, opponent_monster, fusion_levels, xyz_ranks):
    for fusion_level in fusion_levels:
        for xyz_rank in xyz_ranks:
            if fusion_level + 2 * xyz_rank == total_cards:
                if fusion_level + xyz_rank == opponent_monster:
                    return [fusion_level, xyz_rank]

    return [-1, -1]

if len(sys.argv) > 1:
    total_cards = 12
    opponent_monsters = [4, 8, 9]
    fusion_levels = list(range(1, 13))
    xyz_ranks = list(range(1, 13))
else:
    total_cards = int(input("Total Cards: "))
    opponent_monsters = [int(item) for item in input("Opponent's Monsters' Levels Separated by a comma: ").split(',')]
    fusion_levels = [int(item) for item in input("Fusion Monsters Levels Separated by a comma: ").split(',')]
    xyz_ranks = [int(item) for item in input("XYZ Monsters Ranks Separated by a comma: ").split(',')]

max_total_cards = 25
max_opponent_level = 12

grid = [[0 for _ in range(max_total_cards + 1)] for _ in range(max_opponent_level + 1)]

for opponent_level in range(1, max_opponent_level + 1):
    for total_cards in range(1, max_total_cards + 1):
        res = simultaneous_equation_cannon(total_cards, opponent_level, fusion_levels, xyz_ranks)
        if res[0] != -1:
            grid[opponent_level][total_cards] = 1

plt.figure(figsize=(10, 8))
plt.imshow(
    grid, cmap="Greens", origin="lower", extent=[1, max_total_cards, 1, max_opponent_level]
)
plt.xlabel("Total Cards")
plt.ylabel("Opponent's Monster Level")
plt.title("Valid Combinations of Total Cards and Opponent's Monster Levels")
plt.xticks(range(1, max_total_cards + 1, 1))
plt.yticks(range(1, max_opponent_level + 1))
plt.grid(visible=True, which="both", color="gray", linestyle="--", linewidth=0.5)

plt.show()
