import * as THREE from "three";

interface PositionHelperProps {
  totalElements: number;
  gapBetween: number; // distance between adjacent elements
  radius: number;
  activeIndex: number; // index where [0,0,0] should be placed
}

export function getArcPositions({
  totalElements,
  gapBetween,
  radius,
  activeIndex,
}: PositionHelperProps): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  if (totalElements <= 0) return positions;

  const circumference = 2 * Math.PI * radius;
  const angleStep = (gapBetween / circumference) * 2 * Math.PI;

  // Loop through all elements
  for (let i = 0; i < totalElements; i++) {
    if (i === activeIndex) {
      // Active element always at origin
      positions.push(new THREE.Vector3(0, 0, 0));
    } else {
      // offset from active index
      const offset = i - activeIndex;
      const angle = angleStep * offset;

      // 🔑 Important: circle edge starts at origin
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius - radius;

      positions.push(new THREE.Vector3(x, 0, z));
    }
  }

  return positions;
}

type Vec3 = [number, number, number];

/**
 * Generate triangle-like positions on the XZ plane.
 *
 * @param totalModels - total number of models to place
 * @param xGap - horizontal distance between models in the same row (X axis)
 * @param zGap - vertical distance between rows (Z axis)
 * @returns Array of positions [x, y, z]
 */
export function generateTrianglePositions(totalModels: number, xGap: number, zGap: number): Vec3[] {
  const positions: Vec3[] = [];
  let placed = 0;
  let row = 0;

  while (placed < totalModels) {
    const countInRow = row + 1; // row 0 has 1, row 1 has 2, etc.

    for (let i = 0; i < countInRow && placed < totalModels; i++) {
      // Center the row on X
      const offset = (countInRow - 1) * 0.5;
      const x = (i - offset) * xGap;
      const z = -(row * zGap); // 👈 row spacing along negative Z
      positions.push([x, 0, z]);
      placed++;
    }

    row++;
  }

  return positions;
}

/**
 * Get the maximum total number of points that form a perfect triangle
 * without exceeding the given total number of elements.
 *
 * @param totalNumbers - total available elements
 * @returns max perfect triangle count
 */
export function getPerfectTriangleCount(totalNumbers: number): number {
  if (totalNumbers <= 0) return 0;

  // Solve quadratic to get max row count
  const rows = Math.floor((Math.sqrt(8 * totalNumbers + 1) - 1) / 2);

  // Compute the triangular number for that row count
  return (rows * (rows + 1)) / 2;
}
