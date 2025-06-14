export function to_base_unit(val: number, unit: string) {
  if (unit === "kg") {
    return val * 1000;
  }
  return val;
}
