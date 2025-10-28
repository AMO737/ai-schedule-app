import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aischedule.app',
  appName: '学習スケジュール管理',
  webDir: '.next/static',
  // SSRアプリなので、本番URLを指定（ローカル開発時はサーバー起動したURL）
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://schedule-app-gold-tau.vercel.app',
    cleartext: false
  },
  // ネイティブ機能を使うプラグイン
  plugins: {
    App: {
      enabled: true
    }
  }
};

export default config;
