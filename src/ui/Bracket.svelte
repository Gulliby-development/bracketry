<script lang="ts">
  import type { RoundView } from "../types";
  import Round from "./Round.svelte";

  let { rounds, summary }: { rounds: RoundView[]; summary: string } = $props();
</script>

<div class="bracket">
  {#each rounds as round (round.number)}
    <Round {round} />
  {/each}
  <p class="summary">{summary}</p>
</div>
