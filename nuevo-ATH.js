// Bitcoin Indicators Dashboard - Versión Aislada para Blog
// Desarrollado por: Tom Lips & VipTrader

(function() {
    'use strict';

    class BitcoinDashboard {
        constructor(containerId) {
            // Inicializar ATH con un valor por defecto, pero ahora se actualizará dinámicamente
            this.btcATH = 111814.00; // Valor inicial (se actualizará si se supera)
            this.updateInterval = 35 * 60 * 1000;
            this.instanceId = Math.random().toString(36).substr(2, 9);
            this.containerId = containerId;
            this.init();
        }

        // ====== MÉTODO MODIFICADO (solo este cambio) ======
        async fetchData() {
            try {
                // Obtener precio actual de Bitcoin
                const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
                const btcData = await btcResponse.json();
                const btcPrice = btcData.bitcoin.usd;
                const btcChange24h = btcData.bitcoin.usd_24h_change;

                // ====== NUEVA LÓGICA: Actualizar ATH si se supera el máximo ======
                if (btcPrice > this.btcATH) {
                    this.btcATH = btcPrice;
                    // Actualizar el texto del ATH en el HTML
                    const athInfoElements = document.querySelectorAll(`#${this.containerId} .btc-info`);
                    if (athInfoElements.length > 0) {
                        athInfoElements[0].textContent = `Máximo: $${this.btcATH.toLocaleString()}`;
                    }
                }

                // ====== (El resto del método se mantiene IDÉNTICO) ======
                // Obtener Bitcoin Cash para el indicador
                const bchResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd&include_24hr_change=true');
                const bchData = await bchResponse.json();
                const bchChange24h = bchData['bitcoin-cash'].usd_24h_change;

                // ... (todo lo demás permanece exactamente igual)
                // Calcular previsión, alturas de barras, actualizar HTML, etc.
                // ...

            } catch (error) {
                console.error('Error fetching data:', error);
                const summary = document.getElementById(`summary-${this.instanceId}`);
                if (summary) summary.textContent = '❌ Error al cargar datos. Reintentando...';
            }
        }

        // ====== (El resto de la clase se mantiene SIN CAMBIOS) ======
        createStyles() { /* ... */ }
        createHTML() { /* ... */ }
        init() { /* ... */ }
        setup() { /* ... */ }
    }

    // Auto-inicialización (sin cambios)
    function initWidget() {
        const container = document.getElementById('ATH');
        if (container && !container.getAttribute('data-btc-initialized')) {
            container.setAttribute('data-btc-initialized', 'true');
            new BitcoinDashboard('ATH');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    window.BitcoinDashboard = BitcoinDashboard;
})();
