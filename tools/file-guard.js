/* Injected into the repository's own pages by tools/add-file-guard.mjs. Inert over http. __HREF__ is
   replaced with the path to the same page under site/, which is precompiled and opens from a file. */
if (location.protocol === 'file:') {
  document.addEventListener('DOMContentLoaded', function () {
    var h = __HREF__;
    var S = 'font:500 13px/1.6 -apple-system,BlinkMacSystemFont,sans-serif';
    var bar = document.createElement('div');
    bar.setAttribute('style', 'position:fixed;left:0;right:0;top:0;z-index:2147483647;background:#251f1b;color:#fff;padding:10px 14px;' + S);
    bar.innerHTML = 'Opened from a file:// URL, where this page cannot compile its JSX. <a href="' + h + '" style="color:#d6a15f">Open the built copy</a>, or run <code>npm run preview</code>.';
    document.body.appendChild(bar);
    setTimeout(function () {
      var r = document.getElementById('root');
      if (r && !r.childElementCount) {
        r.innerHTML = '<p style="margin:76px 20px 20px;' + S + ';color:#251f1b">Nothing rendered here. This page compiles its JSX in the browser, and a file:// URL cannot fetch the source to compile — so the page is not broken, it is being opened the wrong way. <a href="' + h + '" style="color:#8a6a3b">Open the built copy of this page</a>, or run <code>npm run preview</code> and open it over http.</p>';
      }
    }, 1400);
  });
}
