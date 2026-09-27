const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tempProfile = path.join(process.env.TEMP, 'edge_inspect_' + Math.floor(Math.random() * 100000));

// We will run edge in headless mode and pass a script via data URL or test page that inspects the homepage
const testHtml = `
<!DOCTYPE html>
<html>
<body>
<iframe id="testFrame" src="http://localhost:3000/?consent=1" style="width:390px;height:844px;border:none;"></iframe>
<script>
window.onload = () => {
  setTimeout(() => {
    try {
      const doc = document.getElementById('testFrame').contentDocument;
      const win = document.getElementById('testFrame').contentWindow;
      const width = win.innerWidth;
      const scrollWidth = doc.documentElement.scrollWidth;
      const bodyScrollWidth = doc.body.scrollWidth;
      
      const overflowing = [];
      const all = doc.querySelectorAll('*');
      all.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > width + 1) {
          overflowing.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            right: rect.right,
            width: rect.width,
            diff: rect.right - width,
            text: (el.innerText || '').slice(0, 50)
          });
        }
      });
      
      const result = {
        viewportWidth: width,
        scrollWidth,
        bodyScrollWidth,
        overflowCount: overflowing.length,
        topOverflowing: overflowing.slice(0, 15)
      };
      
      console.log('AUDIT_RESULT:' + JSON.stringify(result));
    } catch (e) {
      console.log('AUDIT_ERROR:' + e.message);
    }
  }, 3000);
};
</script>
</body>
</html>
`;

const htmlPath = path.join(tempProfile, 'test.html');
fs.mkdirSync(tempProfile, { recursive: true });
fs.writeFileSync(htmlPath, testHtml);

const proc = spawn(edgePath, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--user-data-dir=' + tempProfile,
  '--window-size=450,900',
  '--enable-logging=stderr',
  '--v=1',
  'file:///' + htmlPath.replace(/\\\\/g, '/')
]);

let output = '';
proc.stderr.on('data', (d) => {
  const str = d.toString();
  if (str.includes('AUDIT_RESULT') || str.includes('AUDIT_ERROR') || str.includes('console-message')) {
    output += str + '\\n';
  }
});

setTimeout(() => {
  proc.kill();
  console.log(output);
  fs.rmSync(tempProfile, { recursive: true, force: true });
  process.exit(0);
}, 6000);
