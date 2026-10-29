document.addEventListener("DOMContentLoaded", () => {
    const products = window.products || [];

    // Elementos principais do HTML
    const container = document.querySelector("#productGrid");
    const searchInput = document.querySelector("#searchInput");
    const categoryList = document.querySelector("#categoryList");
    const resultsLabel = document.querySelector("#resultsLabel");
    const emptyState = document.querySelector("#emptyState");
    const clearFiltersButton = document.querySelector("#clearFiltersButton");
    const showAllButton = document.querySelector("#showAllButton");

    if (!container) {
        console.error("Não encontrei a área de produtos (#productGrid) no index.html.");
        return;
    }

    // Estado atual dos filtros
    let currentCategory = "Todos";
    let currentSearch = "";

    // Formata o preço em Real
    function formatPrice(value) {
        return Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // Cria o card de um produto
    function createProductCard(product) {
        const card = document.createElement("article");
        card.className = "product-card";

        // Badge de categoria (opcional)
        const badge = document.createElement("span");
        badge.className = "product-badge";
        badge.textContent = product.category || "Achadinho";
        card.appendChild(badge);

        // Imagem
        const image = document.createElement("img");
        image.src = product.image || "";
        image.alt = product.name || "Produto";
        image.loading = "lazy";
        image.onerror = () => {
            image.style.display = "none";
        };
        card.appendChild(image);

        // Conteúdo
        const content = document.createElement("div");
        content.className = "product-content";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category || "Oferta";

        const title = document.createElement("h3");
        title.textContent = product.name || "Produto sem nome";

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description || "Confira esta oferta.";

        const priceRow = document.createElement("div");
        priceRow.className = "price-row";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatPrice(product.price || 0);
        priceRow.appendChild(price);

        const link = document.createElement("a");
        link.className = "button buy-button buy-mercado";
        link.href = product.link || "#";
        link.textContent = "Ver oferta";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const arrow = document.createElement("span");
        arrow.className = "arrow";
        arrow.textContent = "↗";
        link.appendChild(arrow);

        content.append(category, title, description, priceRow, link);
        card.appendChild(content);

        return card;
    }

    // Aplica filtros e renderiza
    function renderProducts() {
        const search = currentSearch.trim().toLowerCase();

        const filtered = products.filter(product => {
            const matchesCategory =
                currentCategory === "Todos" ||
                (product.category || "").toLowerCase() === currentCategory.toLowerCase();

            const matchesSearch =
                !search ||
                (product.name || "").toLowerCase().includes(search) ||
                (product.description || "").toLowerCase().includes(search) ||
                (product.category || "").toLowerCase().includes(search);

            return matchesCategory && matchesSearch;
        });

        container.innerHTML = "";

        if (filtered.length === 0) {
            emptyState.hidden = false;
            resultsLabel.textContent = "Nenhum produto encontrado";
            return;
        }

        emptyState.hidden = true;
        resultsLabel.textContent = `${filtered.length} produto(s) encontrado(s)`;

        const fragment = document.createDocumentFragment();
        filtered.forEach(product => fragment.appendChild(createProductCard(product)));
        container.appendChild(fragment);
    }

    // Marca a categoria ativa
    function updateActiveCategory() {
        if (!categoryList) return;
        categoryList.querySelectorAll(".category-chip").forEach(chip => {
            const isActive = chip.dataset.category === currentCategory;
            chip.classList.toggle("selected", isActive);
        });
    }

    // Eventos de categoria
    if (categoryList) {
        categoryList.addEventListener("click", event => {
            const chip = event.target.closest(".category-chip");
            if (!chip) return;
            currentCategory = chip.dataset.category || "Todos";
            updateActiveCategory();
            renderProducts();
        });
    }

    // Evento de busca
    if (searchInput) {
        searchInput.addEventListener("input", event => {
            currentSearch = event.target.value;
            renderProducts();
        });
    }

    // Limpar filtros
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener("click", () => {
            currentCategory = "Todos";
            currentSearch = "";
            if (searchInput) searchInput.value = "";
            updateActiveCategory();
            renderProducts();
        });
    }

    // Botão "Ver tudo"
    if (showAllButton) {
        showAllButton.addEventListener("click", () => {
            currentCategory = "Todos";
            currentSearch = "";
            if (searchInput) searchInput.value = "";
            updateActiveCategory();
            renderProducts();
        });
    }

    // Atalho "/" para focar a busca
    document.addEventListener("keydown", event => {
        if (event.key === "/" && document.activeElement !== searchInput) {
            event.preventDefault();
            if (searchInput) searchInput.focus();
        }
    });

    // Menu mobile
    const mobileMenuButton = document.querySelector("#mobileMenuButton");
    const mobileNav = document.querySelector("#mobileNav");
    if (mobileMenuButton && mobileNav) {
        mobileMenuButton.addEventListener("click", () => {
            const isOpen = !mobileNav.hidden;
            mobileNav.hidden = isOpen;
            mobileMenuButton.setAttribute("aria-expanded", String(!isOpen));
        });
    }

    // Ano no rodapé
    const yearSpan = document.querySelector("#currentYear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Inicialização
    updateActiveCategory();
    renderProducts();
});