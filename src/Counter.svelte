<script>
  let count = 0;
</script>

<h1>{count}</h1>

<p>
  <button on:click={() => (count = count + 1)} aria-label="Increment">
    +
  </button>
</p>
