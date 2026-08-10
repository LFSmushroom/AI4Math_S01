"""Generate stars.json dataset for AI4Math-Cosmos MVP."""
import json
import math
import random

random.seed(42)

# ── Math problem definitions ──────────────────────────────────────────

SOLVED_THEOREMS = [
    {"name": "Pythagorean Theorem", "desc": "a² + b² = c² for right triangles", "area": "Geometry"},
    {"name": "Prime Number Theorem", "desc": "Distribution of primes ~ x / ln(x)", "area": "Number Theory"},
    {"name": "Fundamental Theorem of Arithmetic", "desc": "Unique prime factorization of integers", "area": "Number Theory"},
    {"name": "Fundamental Theorem of Algebra", "desc": "Every non-constant polynomial has a complex root", "area": "Algebra"},
    {"name": "Four Color Theorem", "desc": "Any planar map is 4-colorable", "area": "Graph Theory"},
    {"name": "Fermat's Last Theorem", "desc": "xⁿ + yⁿ = zⁿ has no integer solutions for n>2", "area": "Number Theory"},
    {"name": "Poincaré Conjecture", "desc": "Every simply connected closed 3-manifold is homeomorphic to S³", "area": "Topology"},
    {"name": "Intermediate Value Theorem", "desc": "Continuous f on [a,b] attains all values between f(a) and f(b)", "area": "Analysis"},
    {"name": "Mean Value Theorem", "desc": "f(b)-f(a) = f'(c)(b-a) for some c in (a,b)", "area": "Analysis"},
    {"name": "Central Limit Theorem", "desc": "Sample mean distribution converges to normal", "area": "Probability"},
    {"name": "Euler's Formula", "desc": "e^(iπ) + 1 = 0", "area": "Complex Analysis"},
    {"name": "Cauchy-Schwarz Inequality", "desc": "|⟨u,v⟩| ≤ ‖u‖·‖v‖", "area": "Linear Algebra"},
    {"name": "Spectral Theorem", "desc": "Symmetric matrices are diagonalizable", "area": "Linear Algebra"},
    {"name": "Banach Fixed Point Theorem", "desc": "Contraction mappings have unique fixed points", "area": "Analysis"},
    {"name": "Gödel's Incompleteness Theorems", "desc": "Any consistent formal system contains unprovable truths", "area": "Logic"},
    {"name": "Cantor's Theorem", "desc": "|A| < |P(A)| for any set A", "area": "Set Theory"},
    {"name": "Heine-Borel Theorem", "desc": "Closed bounded subsets of Rⁿ are compact", "area": "Topology"},
    {"name": "Stokes Theorem", "desc": "∫_∂M ω = ∫_M dω", "area": "Differential Geometry"},
    {"name": "Riemann Mapping Theorem", "desc": "Simply connected proper subsets of C are conformally equivalent to the unit disk", "area": "Complex Analysis"},
    {"name": "Hahn-Banach Theorem", "desc": "Bounded linear functionals on subspaces can be extended", "area": "Functional Analysis"},
    {"name": "Classification of Finite Simple Groups", "desc": "All finite simple groups belong to 18 infinite families + 26 sporadic groups", "area": "Algebra"},
    {"name": "Dirichlet's Theorem", "desc": "Infinitely many primes in arithmetic progressions a + nd with gcd(a,d)=1", "area": "Number Theory"},
    {"name": "Quadratic Reciprocity", "desc": "Relationship between solvability of x²≡p (mod q) and x²≡q (mod p)", "area": "Number Theory"},
    {"name": "Tychonoff's Theorem", "desc": "Arbitrary product of compact spaces is compact", "area": "Topology"},
    {"name": "Brouwer Fixed Point Theorem", "desc": "Every continuous map from a closed ball to itself has a fixed point", "area": "Topology"},
    {"name": "Jordan Curve Theorem", "desc": "Every simple closed curve divides the plane into interior and exterior", "area": "Topology"},
    {"name": "Bolzano-Weierstrass Theorem", "desc": "Every bounded sequence in Rⁿ has a convergent subsequence", "area": "Analysis"},
    {"name": "Lagrange's Theorem", "desc": "Order of a subgroup divides the order of the group", "area": "Algebra"},
    {"name": "Abel-Ruffini Theorem", "desc": "No general algebraic solution for quintic equations", "area": "Algebra"},
    {"name": "Green's Theorem", "desc": "Line integral around a closed curve equals double integral over region", "area": "Analysis"},
    {"name": "Euler's Polyhedron Formula", "desc": "V - E + F = 2 for convex polyhedra", "area": "Geometry"},
    {"name": "Löwenheim-Skolem Theorem", "desc": "If a first-order theory has an infinite model, it has models of all infinite cardinalities", "area": "Logic"},
    {"name": "Chinese Remainder Theorem", "desc": "System of congruences with coprime moduli has a unique solution", "area": "Number Theory"},
    {"name": "Peano Existence Theorem", "desc": "Continuous ODEs have solutions (not necessarily unique)", "area": "Analysis"},
    {"name": "Kuratowski's Theorem", "desc": "A graph is planar iff it contains no K₅ or K₃,₃ minor", "area": "Graph Theory"},
    {"name": "Gauss-Bonnet Theorem", "desc": "Total curvature of a surface = 2π·χ(M)", "area": "Differential Geometry"},
    {"name": "Cayley-Hamilton Theorem", "desc": "Every square matrix satisfies its own characteristic polynomial", "area": "Linear Algebra"},
    {"name": "Yoneda Lemma", "desc": "Natural transformations from Hom(A,-) to F are in bijection with F(A)", "area": "Category Theory"},
    {"name": "Stone-Weierstrass Theorem", "desc": "Any continuous function on a compact set can be uniformly approximated by polynomials", "area": "Analysis"},
    {"name": "Shannon's Source Coding Theorem", "desc": "Lossless compression limit is the entropy of the source", "area": "Information Theory"},
    {"name": "Cook-Levin Theorem", "desc": "SAT is NP-complete", "area": "Complexity Theory"},
    {"name": "PCP Theorem", "desc": "NP = PCP(O(log n), O(1))", "area": "Complexity Theory"},
    {"name": "Rice's Theorem", "desc": "All non-trivial semantic properties of programs are undecidable", "area": "Computability"},
    {"name": "Arrow's Impossibility Theorem", "desc": "No ranked voting system satisfies all fairness criteria", "area": "Game Theory"},
    {"name": "Nash Embedding Theorem", "desc": "Every Riemannian manifold can be isometrically embedded in Euclidean space", "area": "Differential Geometry"},
    {"name": "Artin's Reciprocity Law", "desc": "Generalization of quadratic reciprocity to abelian extensions", "area": "Number Theory"},
    {"name": "Poincaré-Bendixson Theorem", "desc": "Planar dynamical systems have limit sets that are equilibria, periodic orbits, or homoclinic", "area": "Dynamical Systems"},
    {"name": "De Bruijn-Erdős Theorem", "desc": "n points in a plane with no 3 collinear determine at least n lines", "area": "Combinatorics"},
    {"name": "Sylow Theorems", "desc": "Existence and conjugacy of maximal p-subgroups of finite groups", "area": "Algebra"},
    {"name": "von Neumann's Min-Max Theorem", "desc": "Zero-sum games have optimal mixed strategies", "area": "Game Theory"},
]

UNSOLVED_PROBLEMS = [
    {"name": "Riemann Hypothesis", "desc": "All non-trivial zeros of ζ(s) lie on Re(s) = 1/2", "area": "Number Theory"},
    {"name": "P vs NP", "desc": "Is every problem whose solution can be verified quickly also solvable quickly?", "area": "Complexity Theory"},
    {"name": "Goldbach's Conjecture", "desc": "Every even integer > 2 is the sum of two primes", "area": "Number Theory"},
    {"name": "Collatz Conjecture", "desc": "3n+1 sequence always reaches 1 for all positive integers", "area": "Number Theory"},
    {"name": "Twin Prime Conjecture", "desc": "There are infinitely many prime pairs (p, p+2)", "area": "Number Theory"},
    {"name": "Birch and Swinnerton-Dyer Conjecture", "desc": "Rank of elliptic curve relates to order of zero of its L-function at s=1", "area": "Number Theory"},
    {"name": "Hodge Conjecture", "desc": "Certain de Rham cohomology classes are algebraic", "area": "Algebraic Geometry"},
    {"name": "Yang-Mills Mass Gap", "desc": "Existence of quantum Yang-Mills theory with a mass gap", "area": "Mathematical Physics"},
    {"name": "Navier-Stokes Existence", "desc": "Existence and smoothness of solutions to Navier-Stokes equations in 3D", "area": "PDE"},
    {"name": "Hadwiger-Nelson Problem", "desc": "Chromatic number of the Euclidean plane", "area": "Graph Theory"},
    {"name": "Erdős–Straus Conjecture", "desc": "4/n = 1/x + 1/y + 1/z for all n > 1", "area": "Number Theory"},
    {"name": "Lonely Runner Conjecture", "desc": "k runners on a circular track, each is lonely at some time", "area": "Number Theory"},
    {"name": "Frankl's Union-Closed Conjecture", "desc": "In any union-closed family, some element appears in at least half the sets", "area": "Combinatorics"},
    {"name": "Hadamard Matrix Conjecture", "desc": "Hadamard matrices exist for all orders divisible by 4", "area": "Combinatorics"},
    {"name": "Jacobian Conjecture", "desc": "Polynomial map with constant nonzero Jacobian is invertible", "area": "Algebraic Geometry"},
    {"name": "Invariant Subspace Problem", "desc": "Does every bounded linear operator on a separable Hilbert space have a nontrivial invariant subspace?", "area": "Functional Analysis"},
    {"name": "Schanuel's Conjecture", "desc": "Transcendence degree of numbers and their exponentials", "area": "Number Theory"},
    {"name": "Keller's Conjecture", "desc": "In dimension ≤ 7, any tiling by unit hypercubes contains two sharing a full face", "area": "Geometry"},
    {"name": "Toeplitz Conjecture", "desc": "Every simple closed curve in the plane contains the vertices of a square", "area": "Geometry"},
    {"name": "Erdős–Hajnal Conjecture", "desc": "Graphs avoiding an induced subgraph have large cliques or independent sets", "area": "Graph Theory"},
    {"name": "Rota's Basis Conjecture", "desc": "n bases of an n-dim vector space can be arranged into an n×n grid with each row and column a basis", "area": "Linear Algebra"},
    {"name": "Sendov's Conjecture", "desc": "If all roots of a polynomial lie in the unit disk, each root has a critical point within distance 1", "area": "Complex Analysis"},
    {"name": "Graceful Tree Conjecture", "desc": "Every tree has a graceful labeling of its vertices", "area": "Graph Theory"},
    {"name": "Casas-Alvero Conjecture", "desc": "If a polynomial shares a root with each of its derivatives, it is a power of a linear polynomial", "area": "Algebra"},
    {"name": "Erdős–Moser Problem", "desc": "1ᵏ + 2ᵏ + ... + mᵏ = (m+1)ᵏ has only the trivial solution (k=1, m=2)", "area": "Number Theory"},
    {"name": "Bunyakovsky Conjecture", "desc": "Irreducible integer polynomial with gcd 1 of its values produces infinitely many primes", "area": "Number Theory"},
    {"name": "Reconstruction Conjecture", "desc": "Every graph on ≥3 vertices is uniquely determined by its vertex-deleted subgraphs", "area": "Graph Theory"},
    {"name": "Mazur's Conjecture", "desc": "Every rational point on a modular curve of genus > 1 is a cusp or CM point", "area": "Number Theory"},
    {"name": "Carathéodory Conjecture", "desc": "Every smooth closed convex surface in R³ has at least two umbilic points", "area": "Differential Geometry"},
    {"name": "Erdős–Ginzburg–Ziv Theorem (Generalization)", "desc": "In any 2n-1 integers, n have sum divisible by n — generalization to higher dimensions unknown", "area": "Combinatorics"},
    {"name": "Littlewood Conjecture", "desc": "liminf n·‖nα‖·‖nβ‖ = 0 for all real α, β", "area": "Number Theory"},
    {"name": "Andrews-Curtis Conjecture", "desc": "Every balanced presentation of the trivial group can be transformed to the trivial presentation", "area": "Group Theory"},
    {"name": "Whitehead Conjecture", "desc": "Every subcomplex of an aspherical 2-complex is aspherical", "area": "Topology"},
    {"name": "Kakeya Conjecture", "desc": "Besicovitch sets in Rⁿ have Hausdorff dimension n", "area": "Harmonic Analysis"},
    {"name": "Erdős–Faber–Lovász Conjecture", "desc": "Union of k pairwise intersecting k-sets is k-colorable", "area": "Graph Theory"},
    {"name": "Oppenheim Conjecture (Growth Rates)", "desc": "Quantitative version of Oppenheim conjecture for quadratic forms", "area": "Number Theory"},
    {"name": "Perfect Cuboid Problem", "desc": "Does a perfect Euler brick with integer space diagonal exist?", "area": "Number Theory"},
    {"name": "Union-Closed Singleton Conjecture", "desc": "In a union-closed family, there is an element belonging to at least half the sets", "area": "Combinatorics"},
    {"name": "Gurevich Conjecture", "desc": "Every finite generated group is sofic", "area": "Group Theory"},
    {"name": "Baum-Connes Conjecture", "desc": "Assembly map from K-homology to K-theory of group C*-algebra is an isomorphism", "area": "Operator Algebras"},
    {"name": "Deligne's Conjecture on Special Values", "desc": "Motivic L-functions satisfy certain algebraicity properties at integer points", "area": "Number Theory"},
    {"name": "Erdős–Szekeres (Happy Ending) Generalization", "desc": "Minimum points to guarantee a convex n-gon in higher dimensions", "area": "Combinatorics"},
    {"name": "1/3–2/3 Conjecture", "desc": "Every finite poset not a total order has a pair (x,y) such that x < y with probability between 1/3 and 2/3 in linear extensions", "area": "Combinatorics"},
    {"name": "Conway's 99-Graph Problem", "desc": "Does a strongly regular graph with parameters (99,14,1,2) exist?", "area": "Graph Theory"},
    {"name": "Apéry's Constant Generalization", "desc": "Is ζ(3) / π³ transcendental?", "area": "Number Theory"},
    {"name": "Polynomial Hirsch Conjecture", "desc": "The diameter of polyhedra with n facets in d dimensions is bounded by poly(n,d)", "area": "Combinatorics"},
    {"name": "Erdős–Moser Conjecture", "desc": "Equation 1ᵏ + 2ᵏ + ... + (m-1)ᵏ = mᵏ only has trivial solutions", "area": "Number Theory"},
    {"name": "Gilbreath's Conjecture", "desc": "Iterated absolute differences of primes starting with 2 gives sequences all starting with 1", "area": "Number Theory"},
    {"name": "Grimm's Conjecture", "desc": "For each n, there are n consecutive composite numbers each divisible by a distinct prime", "area": "Number Theory"},
    {"name": "Lehmer's Totient Problem", "desc": "If φ(n) divides n-1, must n be prime?", "area": "Number Theory"},
]

# ── 3D coordinate generation (Fibonacci sphere + random perturbation) ──

def fibonacci_sphere(n: int, radius: float = 10.0):
    """Distribute n points approximately uniformly on a sphere."""
    points = []
    phi = math.pi * (3.0 - math.sqrt(5.0))
    for i in range(n):
        y = 1.0 - (i / float(n - 1)) * 2.0
        radius_at_y = math.sqrt(1.0 - y * y)
        theta = phi * i
        x = math.cos(theta) * radius_at_y
        z = math.sin(theta) * radius_at_y
        # Add slight random perturbation to avoid perfect uniformity
        jitter = 0.3
        points.append([
            x * radius + random.uniform(-jitter, jitter),
            y * radius + random.uniform(-jitter, jitter),
            z * radius + random.uniform(-jitter, jitter),
        ])
    return points


def generate_edges(solved_nodes, unsolved_nodes, max_edges=120):
    """Generate connections between related nodes."""
    edges = []
    all_nodes = solved_nodes + unsolved_nodes
    all_ids = [n["id"] for n in all_nodes]

    # Build area groups
    area_groups = {}
    for n in all_nodes:
        area_groups.setdefault(n["area"], []).append(n["id"])

    # Connect nodes within the same area
    for area, ids in area_groups.items():
        for i in range(len(ids)):
            for j in range(i + 1, min(i + 3, len(ids))):
                if len(edges) < max_edges:
                    edges.append([ids[i], ids[j]])

    # Add some cross-area connections
    for _ in range(30):
        if len(edges) >= max_edges:
            break
        a = random.choice(all_ids)
        b = random.choice(all_ids)
        if a != b and [a, b] not in edges and [b, a] not in edges:
            edges.append([a, b])

    return edges[:max_edges]


def main():
    # Assign IDs
    solved = []
    for i, t in enumerate(SOLVED_THEOREMS):
        solved.append({
            "id": f"thm-{i:03d}",
            "name": t["name"],
            "description": t["desc"],
            "area": t["area"],
            "importance": random.randint(2, 4),
            "ai_difficulty": random.randint(1, 4),
            "status": "solved",
            "pos": [0, 0, 0],  # placeholder
            "related": [],
        })

    unsolved = []
    for i, p in enumerate(UNSOLVED_PROBLEMS):
        unsolved.append({
            "id": f"opg-{i:03d}",
            "name": p["name"],
            "description": p["desc"],
            "area": p["area"],
            "importance": random.randint(2, 4),
            "ai_difficulty": random.randint(3, 5),
            "status": "unsolved",
            "pos": [0, 0, 0],
            "related": [],
        })

    all_nodes = solved + unsolved
    total = len(all_nodes)

    # Generate 3D positions
    positions = fibonacci_sphere(total, radius=10.0)
    for node, pos in zip(all_nodes, positions):
        node["pos"] = [round(p, 4) for p in pos]

    # Generate edges
    edges = generate_edges(solved, unsolved, max_edges=120)

    # Assign related IDs to each node
    edge_map = {n["id"]: [] for n in all_nodes}
    for a, b in edges:
        edge_map[a].append(b)
        edge_map[b].append(a)

    for node in all_nodes:
        node["related"] = edge_map[node["id"]]

    # Build output
    output = {
        "meta": {
            "total_nodes": total,
            "solved_count": len(solved),
            "unsolved_count": len(unsolved),
            "total_edges": len(edges),
            "coordinate_system": "fibonacci_sphere_3d",
            "radius": 10.0,
        },
        "nodes": all_nodes,
        "edges": edges,
    }

    output_path = "/workspace/cosmos/backend/data/stars.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Generated {output_path}")
    print(f"  Nodes: {total} ({len(solved)} solved, {len(unsolved)} unsolved)")
    print(f"  Edges: {len(edges)}")
    print(f"  Areas: {sorted(set(n['area'] for n in all_nodes))}")


if __name__ == "__main__":
    main()