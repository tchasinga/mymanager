import { bouncy } from "ldrs";

bouncy.register();

export default function Load() {
  return (
    <div>
      <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
    </div>
  );
}
