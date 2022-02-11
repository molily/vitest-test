<script>
let count = 0;
</script>

<h1>{count}</h1>

<p>
  <button type="button" on:click={() => count = count + 1}>
    +
  </button>
</p>