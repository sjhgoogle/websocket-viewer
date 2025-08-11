import { useLocation } from "preact-iso";

export function Header() {
  const uL = useLocation();

  return (
    <header class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button class="btn btn-ghost btn-sm">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 class="text-xl font-semibold">WebSocket Demo</h1>
          <a
            href=""
            class="btn btn-ghost btn-sm"
            onClick={() => uL.route("/")}
          >
            /
          </a>
          <a
            href=""
            class="btn btn-ghost btn-sm"
            onClick={() => uL.route("/demo")}
          >
            /데모
          </a>
          <a
            href=""
            class="btn btn-ghost btn-sm"
            onClick={() => uL.route("/describe")}
          >
            /개념
          </a>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span class="text-sm text-gray-600">Connected</span>
        </div>
      </div>
    </header>
  );
}
