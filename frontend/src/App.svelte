<script>
  import { onMount } from "svelte";

  let message = "";

  async function loadMessage() {
    const res = await fetch("/api/ping");
    const data = await res.json();

    message = data.message;
  }

  onMount(() => {
    console.log("Component mounted");
    // run code when component is first rendered in DOM

    connectWs();
  });

  async function connectWs() {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send(JSON.stringify({ test: "httpyac" }));
    };

    ws.onmessage = (event) => {
      // console.log("Message from server:", event.data);
      const res = JSON.parse(event.data);

      console.log(res);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }
</script>

<main>
  <h1>Svelteff + Express</h1>
  <button on:click={loadMessage}>Load Message</button>
  <p>{message}</p>
</main>
