export { grade9Official2022 } from "./2022/index.ts";
export { grade9Official2023 } from "./2023/index.ts";
export { grade9Official2024 } from "./2024/index.ts";

import { grade9Official2022 } from "./2022/index.ts";
import { grade9Official2023 } from "./2023/index.ts";
import { grade9Official2024 } from "./2024/index.ts";

export const grade9OfficialRegistry = {
  2022: grade9Official2022,
  2023: grade9Official2023,
  2024: grade9Official2024,
} as const;
