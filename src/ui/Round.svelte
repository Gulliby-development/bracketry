<script lang="ts">
  import type { RoundView } from "../types";
  import MatchCard from "./MatchCard.svelte";

  let { round }: { round: RoundView } = $props();
</script>

<section class="round" data-round={round.number}>
  <h2>{round.title}</h2>
  <ol>
    {#each round.matches as match (match.id)}
      <MatchCard {match} />
    {/each}
  </ol>
</section>
