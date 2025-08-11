<script>
  let message = '';

  async function loadMessage() {
    const res = await fetch('/api/ping');
    const data = await res.json();

    message = data.message;
  }
</script>

<main>
  <h1>Svelteff + Express</h1>
  <button on:click={loadMessage}>Load Message</button>
  <p>{message}</p>
</main>

