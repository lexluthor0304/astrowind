import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'ホーム',
      href: getPermalink('/', 'home'),
    },
    {
      text: 'ソリューション',
      links: [
        { text: 'ソリューション一覧', href: getPermalink('/#solutions') },
        { text: '楽Platformの開発販売', href: getPermalink('/solution/rakuplatform') },
        { text: 'Salesforce導入・運用支援', href: getPermalink('/solution/salesforce') },
        { text: 'AIソリューション開発・導入支援', href: getPermalink('/solution/ai') },
        { text: '各種SaaSシステム受託開発', href: getPermalink('/solution/others') },
      ],
    },
    {
      text: '会社情報',
      href: getPermalink('/about'),
    },
    {
      text: 'チーム紹介',
      href: getPermalink('/team'),
    },
    {
      text: 'ブログ',
      href: getPermalink('/blog', 'blog'),
    },
    {
      text: '個人情報保護方針',
      href: getPermalink('/privacy'),
    },
    {
      text: '電子公告',
      href: getPermalink('/electronic-notice'),
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
        { text: '楽Platformの開発販売', href: getPermalink('/solution/rakuplatform') },
        { text: 'Salesforce導入・運用支援', href: getPermalink('/solution/salesforce') },
        { text: 'AIソリューション開発・導入支援', href: getPermalink('/solution/ai') },
        { text: '各種SaaSシステム受託開発', href: getPermalink('/solution/others') },
        { text: '会社情報', href: getPermalink('/about') },
        { text: 'チーム紹介', href: getPermalink('/team') },
        { text: 'ブログ', href: getPermalink('/blog', 'blog') },
        { text: 'お問い合わせ', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'ポリシー',
      links: [
        { text: '個人情報保護方針', href: getPermalink('/privacy') },
        { text: '電子公告', href: getPermalink('/electronic-notice') },
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
