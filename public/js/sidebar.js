(function() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  if (!sidebar || !toggle) return;

  const STORAGE_KEY = 'sidebar-collapsed';

  function setCollapsed(collapsed) {
    sidebar.dataset.collapsed = String(collapsed);
    const layout = document.querySelector('.layout-with-sidebar');
    if (layout) {
      layout.dataset.sidebarCollapsed = String(collapsed);
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch (e) {}
  }

  function isCollapsed() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === null ? true : stored === 'true';
    } catch (e) {
      return true;
    }
  }

  toggle.addEventListener('click', function() {
    const collapsed = sidebar.dataset.collapsed !== 'true';
    setCollapsed(collapsed);
  });

  if (isCollapsed()) {
    setCollapsed(true);
  }

  // Exposed so the landing page "Projects" button can open the sidebar
  window.expandSidebar = function() {
    setCollapsed(false);
  };

  document.documentElement.classList.remove('sidebar-preload-collapsed');

  // ── Project tooltip on hover ──────────────────────────────
  var tooltip = document.getElementById('project-tooltip');
  if (tooltip) {
    var tooltipImg   = document.getElementById('project-tooltip-img');
    var tooltipTitle = tooltip.querySelector('.project-tooltip-title');
    var tooltipDesc  = tooltip.querySelector('.project-tooltip-description');

    function positionTooltip(item) {
      var sidebarRect = sidebar.getBoundingClientRect();
      var itemRect    = item.getBoundingClientRect();
      var gap         = 8;
      var left        = sidebarRect.right + gap;

      // Top-align the tooltip to the top of the hovered item, clamped to viewport
      var tooltipH    = tooltip.offsetHeight;
      var top         = itemRect.top;
      top = Math.max(8, Math.min(top, window.innerHeight - tooltipH - 8));

      tooltip.style.left = left + 'px';
      tooltip.style.top  = top  + 'px';
    }

    document.querySelectorAll('.sidebar-project-item').forEach(function(item) {
      item.addEventListener('mouseenter', function() {
        var image       = this.dataset.tooltipImage       || '';
        var title       = this.dataset.tooltipTitle       || '';
        var description = this.dataset.tooltipDescription || '';

        if (!title && !image) return;

        tooltipImg.src       = image;
        tooltipImg.alt       = title;
        tooltipTitle.textContent = title;
        tooltipDesc.textContent  = description;

        // Show briefly hidden so offsetHeight is measurable, then position
        tooltip.style.visibility = 'hidden';
        tooltip.classList.add('project-tooltip--visible');
        positionTooltip(this);
        tooltip.style.visibility = '';
      });

      item.addEventListener('mouseleave', function() {
        tooltip.classList.remove('project-tooltip--visible');
      });
    });
  }
})();
