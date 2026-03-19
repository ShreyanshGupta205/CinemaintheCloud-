 // 🔥 FIXED EFFECTS SYSTEM v4.0 - 100% WORKING
export function initEffects(state, dom, editor) {
    const listEl = document.getElementById("effectsList");
    const previewCanvas = document.getElementById("previewCanvas") || document.querySelector('.preview-canvas');
    const propertiesContent = document.getElementById("propertiesContent") || document.querySelector('.properties-content');
    
    if (!listEl) {
        console.error("❌ effectsList not found!");
        return null;
    }

    // 🔥 EFFECTS LIBRARY
    const presets = [
        { id: "blur", name: "Blur", type: "filter", params: { intensity: 0.5 }, icon: "💨", category: "filter" },
        { id: "brightness", name: "Brightness", type: "filter", params: { amount: 1.2 }, icon: "☀️", category: "filter" },
        { id: "contrast", name: "Contrast", type: "filter", params: { amount: 1.2 }, icon: "🎨", category: "filter" },
        { id: "grayscale", name: "Grayscale", type: "filter", params: {}, icon: "🖤", category: "filter" },
        { id: "sepia", name: "Sepia", type: "filter", params: {}, icon: "📜", category: "filter" },
        { id: "fade-in", name: "Fade In", type: "animation", duration: 1, icon: "✨", category: "transition" },
        { id: "zoom-in", name: "Zoom In", type: "animation", params: { scale: 1.2 }, icon: "🔍", category: "motion" },
    ];

    let activeClip = null;
    let currentEffect = null;

    // 🔥 RENDER EFFECTS LIST (IMMEDIATE)
    function renderEffectsList() {
        listEl.innerHTML = `
            <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(99,102,241,0.3);">
                <h3 style="margin: 0; font-size: 16px; color: white;">✨ Effects Library</h3>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px;">
                ${presets.map(preset => `
                    <div class="effect-item" data-effect-id="${preset.id}" draggable="true" 
                         style="padding: 16px; background: linear-gradient(145deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1)); 
                                border: 2px solid rgba(16,185,129,0.4); border-radius: 12px; cursor: grab; 
                                text-align: center; transition: all 0.2s; user-select: none;">
                        <div style="font-size: 24px; margin-bottom: 8px;">${preset.icon}</div>
                        <div style="font-size: 12px; font-weight: 600; color: white;">${preset.name}</div>
                        <div style="font-size: 10px; color: #9ca3af;">${preset.category}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // 🔥 ADD EVENT LISTENERS AFTER RENDER
        document.querySelectorAll('.effect-item').forEach(item => {
            item.addEventListener('click', () => applyEffect(presets.find(p => p.id === item.dataset.effectId)));
            item.addEventListener('dragstart', (e) => {
                const preset = presets.find(p => p.id === item.dataset.effectId);
                e.dataTransfer.setData("application/x-effect", JSON.stringify(preset));
            });
        });
    }

    // 🔥 FIXED APPLY EFFECT
    function applyEffect(preset, clip = editor?.state?.selectedClip || window.editor?.state?.selectedClip) {
        console.log("🔥 Applying effect:", preset.name, "to clip:", clip);
        
        if (!clip) {
            showNotification("❌ Select a clip first in timeline!", "warning");
            return;
        }

        // 🔥 INITIALIZE CLIP EFFECTS
        if (!clip.effects) clip.effects = [];

        // 🔥 ADD/UPDATE EFFECT
        const existingIndex = clip.effects.findIndex(e => e.id === preset.id);
        const effectData = {
            id: preset.id,
            name: preset.name,
            type: preset.type,
            params: preset.params ? { ...preset.params } : {},
            strength: 1.0
        };

        if (existingIndex > -1) {
            clip.effects[existingIndex] = effectData;
        } else {
            clip.effects.push(effectData);
        }

        activeClip = clip;
        currentEffect = effectData;

        showNotification(`✨ "${preset.name}" applied!`, "success");
        renderEffectControls(effectData);
        previewEffectOnCanvas();
        
        // 🔥 UPDATE TIMELINE
        if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent("editor:clip-updated", { detail: { clipId: clip.id } }));
        }
    }

    // 🔥 GLOBAL EFFECTS CONTROLS (Fixed Scope)
    window.editorEffects = {
        updateParam: (param, value) => {
            if (!currentEffect?.params || !activeClip) return;
            
            const numValue = parseFloat(value);
            currentEffect.params[param] = numValue;
            
            const effect = activeClip.effects.find(e => e.id === currentEffect.id);
            if (effect) effect.params[param] = numValue;
            
            previewEffectOnCanvas();
            showNotification(`${param}: ${(numValue*100).toFixed(0)}%`, "info");
        },
        
        removeEffect: () => {
            if (!activeClip || !currentEffect) return;
            activeClip.effects = activeClip.effects.filter(e => e.id !== currentEffect.id);
            
            if (propertiesContent) {
                propertiesContent.innerHTML = '<div style="padding:40px;text-align:center;color:#9ca3af;">No active effects<br><small>Select clip → Apply effect</small></div>';
            }
            
            previewEffectOnCanvas();
            showNotification("🗑️ Effect removed", "info");
            currentEffect = null;
        },
        
        resetEffect: () => {
            if (!activeClip || !currentEffect) return;
            const preset = presets.find(p => p.id === currentEffect.id);
            const effect = activeClip.effects.find(e => e.id === currentEffect.id);
            
            if (preset && effect) {
                effect.params = { ...preset.params };
                renderEffectControls(currentEffect);
                previewEffectOnCanvas();
                showNotification("🔄 Reset to default", "info");
            }
        }
    };

    // 🔥 EFFECT CONTROLS UI
    function renderEffectControls(effect) {
        if (!propertiesContent) return;

        propertiesContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 24px; padding: 20px; background: rgba(99,102,241,0.1); border-radius: 12px;">
                <h3 style="color: #6366f1; margin: 0 0 8px 0; font-size: 20px;">${effect.icon || '✨'} ${effect.name}</h3>
                <div style="color: #9ca3af; font-size: 13px;">${effect.type.toUpperCase()} Effect</div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 20px;">
                ${createEffectSliders(effect)}
                
                <div style="display: flex; gap: 12px;">
                    <button onclick="editorEffects.removeEffect()" 
                            style="flex:1; padding:12px; background:rgba(239,68,68,0.2); color:#ef4444; border:none; border-radius:8px; font-weight:600; cursor:pointer; transition:0.2s;">
                        🗑️ Remove Effect
                    </button>
                    <button onclick="editorEffects.resetEffect()" 
                            style="flex:1; padding:12px; background:rgba(99,102,241,0.2); color:#6366f1; border:none; border-radius:8px; font-weight:600; cursor:pointer; transition:0.2s;">
                        🔄 Reset
                    </button>
                </div>
            </div>
        `;
    }

    function createEffectSliders(effect) {
        const params = effect.params || {};
        const sliders = [];

        // 🔥 DYNAMIC SLIDERS BASED ON EFFECT
        if (effect.id === 'blur') {
            sliders.push(createSlider('intensity', params.intensity || 0.5, 'Blur Intensity', 0, 3));
        } else if (effect.id === 'brightness' || effect.id === 'contrast') {
            sliders.push(createSlider('amount', params.amount || 1, effect.name, 0, 3));
        } else {
            sliders.push('<div style="text-align:center;color:#9ca3af;padding:20px;">No adjustable parameters</div>');
        }

        return sliders.join('');
    }

    function createSlider(param, value, label, min, max) {
        return `
            <div style="padding: 16px; background: rgba(15,23,42,0.8); border-radius: 8px; border: 1px solid rgba(99,102,241,0.3);">
                <div style="font-size: 13px; color: #9ca3af; margin-bottom: 12px;">${label}</div>
                <input type="range" min="${min}" max="${max}" step="0.01" value="${value}" 
                       style="width: 100%; height: 8px; border-radius: 4px; background: rgba(99,102,241,0.2); accent-color: #6366f1;"
                       onchange="editorEffects.updateParam('${param}', this.value)"
                       oninput="this.nextElementSibling.textContent = (this.value*100).toFixed(0) + '%'">
                <div style="font-size: 12px; color: #cbd5e1; text-align: center; margin-top: 4px;">
                    ${(value*100).toFixed(0)}%
                </div>
            </div>
        `;
    }

    // 🔥 PREVIEW EFFECT
    function previewEffectOnCanvas() {
        if (!previewCanvas || !activeClip) return;

        const ctx = previewCanvas.getContext('2d');
        previewCanvas.width = 320;
        previewCanvas.height = 180;

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 320, 180);
        gradient.addColorStop(0, '#1e1b4b');
        gradient.addColorStop(1, '#0f0f23');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 320, 180);

        // Effect preview
        ctx.save();
        ctx.filter = buildCSSFilter(activeClip.effects || []);
        ctx.fillStyle = '#6366f1';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 20;
        ctx.fillRect(40, 40, 240, 100);
        ctx.restore();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${activeClip?.name || 'Clip'} → Effect Active`, 160, 160);
    }

    function buildCSSFilter(effects) {
        const filters = [];
        effects.forEach(effect => {
            switch(effect.id) {
                case 'blur': filters.push(`blur(${effect.params?.intensity * 10 || 5}px)`); break;
                case 'brightness': filters.push(`brightness(${effect.params?.amount || 1})`); break;
                case 'contrast': filters.push(`contrast(${effect.params?.amount || 1})`); break;
                case 'grayscale': filters.push('grayscale(100%)'); break;
                case 'sepia': filters.push('sepia(100%)'); break;
            }
        });
        return filters.join(' ') || 'none';
    }

    // 🔥 NOTIFICATION
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            padding: 16px 24px; border-radius: 12px; font-weight: 600; font-size: 14px;
            color: white; min-width: 280px; backdrop-filter: blur(10px);
            background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#6366f1'};
            box-shadow: 0 20px 40px rgba(0,0,0,0.3); transform: translateX(400px);
            animation: slideIn 0.3s ease forwards;
        `;
        notification.innerHTML = ` ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // 🔥 STARTUP
    renderEffectsList();
    console.log("✅ Effects system v4.0 initialized!");

    return {
        presets,
        applyEffect,
        renderEffectsList,
        previewEffectOnCanvas,
        showNotification
    };
}