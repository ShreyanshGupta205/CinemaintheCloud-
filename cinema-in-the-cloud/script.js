// SPLASH
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
  }, 3000);
});

// AI Drawer Toggle
const aiDrawer = document.getElementById("ai-drawer");
document.getElementById("ai-tools-btn").onclick = () => aiDrawer.classList.toggle("open");
document.getElementById("close-ai").onclick = () => aiDrawer.classList.remove("open");

// Video control placeholders
document.querySelectorAll(".preview-controls button").forEach(btn=>{
  btn.onclick=()=>alert(`${btn.textContent} feature coming soon!`);
});

// AI Modal Simulation
const modal=document.getElementById("ai-modal");
const modalTitle=document.getElementById("ai-modal-title");
const modalText=document.getElementById("ai-modal-text");
document.getElementById("close-modal").onclick=()=>modal.classList.add("hidden");

document.querySelectorAll("#ai-drawer .drawer-content button").forEach(btn=>{
  btn.onclick=()=>{
    modal.classList.remove("hidden");
    modalTitle.textContent="🤖 " + btn.textContent + " Running...";
    modalText.textContent="AI is processing your media using simulated intelligence... ⏳";
    setTimeout(()=>{
      modalTitle.textContent="✅ Task Complete";
      modalText.textContent=`"${btn.textContent}" executed successfully. (Demo simulation)`;
    },2000);
  };
});
