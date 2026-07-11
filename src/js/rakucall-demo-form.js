function endpointFor(form) {
  if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://127.0.0.1:4173/api/public/demo-applications';
  }
  return form.dataset.endpoint || 'https://rakucall.ai/api/public/demo-applications';
}
export function initRakuCallDemoForm() {
  const form = document.getElementById('rakucall-demo-form');
  if (!(form instanceof HTMLFormElement)) return;

  const submitButton = form.querySelector('[type="submit"]');
  const status = document.getElementById('rakucall-form-status');
  if (!(submitButton instanceof HTMLButtonElement) || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.hidden = true;
    status.className = 'rakucall-form-status';
    submitButton.disabled = true;
    const originalLabel = submitButton.textContent;
    submitButton.textContent = '送信中...';

    const formData = new FormData(form);
    const payload = {
      companyName: formData.get('companyName'),
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phoneNumber: formData.get('phoneNumber'),
      purpose: formData.get('purpose'),
      preferredContactTime: formData.get('preferredContactTime'),
      consentPrivacy: formData.get('consentPrivacy') === 'on',
      consentAiCall: formData.get('consentAiCall') === 'on',
      website: formData.get('website') || '',
    };

    try {
      const response = await fetch(endpointFor(form), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || '送信に失敗しました。時間をおいて再度お試しください。');
      }

      form.reset();
      status.classList.add('is-success');
      status.textContent = result?.message || 'AI架電デモのお申し込みを受け付けました。';
      status.hidden = false;
      status.focus();
    } catch (error) {
      status.classList.add('is-error');
      status.textContent = error instanceof Error ? error.message : '送信に失敗しました。';
      status.hidden = false;
      status.focus();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
}
