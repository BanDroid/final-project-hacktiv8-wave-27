export async function onPageTransitionEnd() {
  console.log("Page transition end");
  document.querySelector("main")?.classList.remove("page-transition");
}
