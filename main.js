// ---------- Mobile nav ----------
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('nav.links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ---------- Careers: department filter + qualification filter (combined) ----------
const roleFilterTabs = document.querySelectorAll('[data-role-filter]');
const qualFilterSelect = document.getElementById('qualFilter');
const roleCards = document.querySelectorAll('[data-dept]');
const noMatchMsg = document.querySelector('.no-match-msg');

const QUAL_LEVELS = ['spm', 'diploma', 'degree', 'master'];

function qualIndex(key) {
  return QUAL_LEVELS.indexOf(key);
}

function applyRoleFilters() {
  if (!roleCards.length) return;

  const activeDeptTab = document.querySelector('[data-role-filter].active');
  const deptFilter = activeDeptTab ? activeDeptTab.getAttribute('data-role-filter') : 'all';
  const qualFilter = qualFilterSelect ? qualFilterSelect.value : 'all';

  let visibleCount = 0;

  roleCards.forEach(card => {
    const dept = card.getAttribute('data-dept');
    const minQual = card.getAttribute('data-minqual');

    const deptOk = deptFilter === 'all' || dept === deptFilter;
    const qualOk = qualFilter === 'all' || qualIndex(qualFilter) >= qualIndex(minQual);

    if (deptOk && qualOk) {
      card.classList.remove('hidden-role');
      visibleCount++;
    } else {
      card.classList.add('hidden-role');
    }
  });

  if (noMatchMsg) {
    noMatchMsg.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

roleFilterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    roleFilterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    applyRoleFilters();
  });
});

if (qualFilterSelect) {
  qualFilterSelect.addEventListener('change', applyRoleFilters);
}

// ---------- Role accordion (careers.html) ----------
document.querySelectorAll('.role-head').forEach(head => {
  head.addEventListener('click', () => {
    const card = head.closest('.role-card');
    const isOpen = card.classList.toggle('open');
    head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});

// ---------- "Apply for this role" pre-fills the role dropdown below ----------
document.querySelectorAll('.apply-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const roleName = btn.getAttribute('data-role-name');
    const roleSelect = document.getElementById('cRole');
    if (roleSelect && roleName) {
      const match = Array.from(roleSelect.options).find(opt => opt.value === roleName || opt.textContent.trim() === roleName);
      if (match) roleSelect.value = match.value;
    }
  });
});

// ---------- File drop label (careers.html application form) ----------
const resumeInput = document.getElementById('resumeUpload');
const resumeLabel = document.getElementById('resumeLabel');
if (resumeInput && resumeLabel) {
  resumeInput.addEventListener('change', () => {
    resumeLabel.textContent = resumeInput.files.length
      ? `Selected: ${resumeInput.files[0].name}`
      : 'Click to upload your resume (PDF, max 5MB)';
  });
}

// ---------- Real submission success detection ----------
// Forms now genuinely POST to FormSubmit, which redirects back with ?sent=...
// This shows the success message on the page the person lands back on.
const params = new URLSearchParams(window.location.search);
if (params.get('sent')) {
  const successBox = document.querySelector('.success-msg');
  if (successBox) {
    successBox.classList.add('show');
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
