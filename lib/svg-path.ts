type Point = {
  x: number;
  y: number;
};

type PathBounds = {
  height: number;
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  width: number;
};

function tokenizePath(path: string) {
  return path.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
}

function collectPathPoints(path: string) {
  const tokens = tokenizePath(path);
  const points: Point[] = [];
  let index = 0;
  let command = "";
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  const readNumber = () => Number(tokens[index++] ?? 0);
  const pushPoint = (x: number, y: number) => {
    points.push({ x, y });
    currentX = x;
    currentY = y;
  };

  while (index < tokens.length) {
    const token = tokens[index] ?? "";

    if (/^[a-zA-Z]$/.test(token)) {
      command = token;
      index += 1;
    }

    switch (command) {
      case "M":
      case "L": {
        const x = readNumber();
        const y = readNumber();
        pushPoint(x, y);
        if (command === "M") {
          startX = x;
          startY = y;
          command = "L";
        }
        break;
      }
      case "m":
      case "l": {
        const x = currentX + readNumber();
        const y = currentY + readNumber();
        pushPoint(x, y);
        if (command === "m") {
          startX = x;
          startY = y;
          command = "l";
        }
        break;
      }
      case "H": {
        pushPoint(readNumber(), currentY);
        break;
      }
      case "h": {
        pushPoint(currentX + readNumber(), currentY);
        break;
      }
      case "V": {
        pushPoint(currentX, readNumber());
        break;
      }
      case "v": {
        pushPoint(currentX, currentY + readNumber());
        break;
      }
      case "C": {
        const controlOneX = readNumber();
        const controlOneY = readNumber();
        const controlTwoX = readNumber();
        const controlTwoY = readNumber();
        const endX = readNumber();
        const endY = readNumber();
        points.push(
          { x: controlOneX, y: controlOneY },
          { x: controlTwoX, y: controlTwoY },
          { x: endX, y: endY },
        );
        currentX = endX;
        currentY = endY;
        break;
      }
      case "c": {
        const controlOneX = currentX + readNumber();
        const controlOneY = currentY + readNumber();
        const controlTwoX = currentX + readNumber();
        const controlTwoY = currentY + readNumber();
        const endX = currentX + readNumber();
        const endY = currentY + readNumber();
        points.push(
          { x: controlOneX, y: controlOneY },
          { x: controlTwoX, y: controlTwoY },
          { x: endX, y: endY },
        );
        currentX = endX;
        currentY = endY;
        break;
      }
      case "S":
      case "Q": {
        const controlOneX = readNumber();
        const controlOneY = readNumber();
        const endX = readNumber();
        const endY = readNumber();
        points.push(
          { x: controlOneX, y: controlOneY },
          { x: endX, y: endY },
        );
        currentX = endX;
        currentY = endY;
        break;
      }
      case "s":
      case "q": {
        const controlOneX = currentX + readNumber();
        const controlOneY = currentY + readNumber();
        const endX = currentX + readNumber();
        const endY = currentY + readNumber();
        points.push(
          { x: controlOneX, y: controlOneY },
          { x: endX, y: endY },
        );
        currentX = endX;
        currentY = endY;
        break;
      }
      case "T": {
        pushPoint(readNumber(), readNumber());
        break;
      }
      case "t": {
        pushPoint(currentX + readNumber(), currentY + readNumber());
        break;
      }
      case "Z":
      case "z": {
        pushPoint(startX, startY);
        break;
      }
      default: {
        index += 1;
        break;
      }
    }
  }

  return points;
}

export function computePathCollectionBounds(paths: string[]): PathBounds {
  const points = paths.flatMap((path) => collectPathPoints(path));

  if (points.length === 0) {
    return {
      height: 1,
      maxX: 1,
      maxY: 1,
      minX: 0,
      minY: 0,
      width: 1,
    };
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    height: Math.max(1, maxY - minY),
    maxX,
    maxY,
    minX,
    minY,
    width: Math.max(1, maxX - minX),
  };
}
