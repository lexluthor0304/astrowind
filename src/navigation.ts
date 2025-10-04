import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'ホーム',
      href: getPermalink('/', 'home'),
    },
    {
      text: 'ソリューション',
      href: getPermalink('/#solutions'),
    },
    {
      text: '会社情報',
      href: getPermalink('/#about'),
    },
    {
      text: '個人情報保護方針',
      href: getPermalink('/privacy'),
    },
  ],
  actions: [{ text: 'お問い合わせ', href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
    {
      title: 'メニュー',
      links: [
        { text: 'ホーム', href: getPermalink('/', 'home') },
        { text: 'ソリューション', href: getPermalink('/#solutions') },
        { text: '会社情報', href: getPermalink('/#about') },
        { text: 'お問い合わせ', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'ポリシー',
      links: [
        { text: '個人情報保護方針', href: getPermalink('/privacy') },
        { text: '利用規約', href: getPermalink('/terms') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `
    © ${new Date().getFullYear()} Rakucloud株式会社
  `,
};
