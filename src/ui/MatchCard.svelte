<script lang="ts">
  import type { MatchView } from "../types";

  let { match }: { match: MatchView } = $props();
</script>

<li class="match" data-state={match.state}>
  <span class="id">{match.id}</span>
  <span class="side">{match.left}</span>
  {#if match.right !== ""}
    <span class="side">{match.right}</span>
  {/if}
  {#if match.note !== ""}
    <span class="note">{match.note}</span>
  {/if}
</li>
