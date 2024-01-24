export default function Footer(){
  return (
    <footer class="bg-white dark:bg-gray-900">
    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div class="md:flex md:justify-between">
          <div class="mb-6 md:mb-0">
              <a href="http://localhost:3000/" class="flex items-center">
                  <img src="/logo.png" class="h-12 me-3" alt="Remote PI Logo" />
                  <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Remote PI</span>
              </a>
          </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div class="sm:flex sm:items-center sm:justify-between">
          <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" class="hover:underline">Flowbite™</a>. All Rights Reserved.
          </span>

      </div>
    </div>
</footer>
  )
}