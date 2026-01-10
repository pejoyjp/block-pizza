'use client';

import { useEffect } from 'react';

export default function DatabaseInit() {
  useEffect(() => {
    // 在客户端触发数据库连接检查
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          console.log('🔗 数据库连接状态检查完成');
        }
      } catch (error) {
        console.error('⚠️ 数据库连接检查失败:', error);
      }
    };

    checkConnection();
  }, []);

  return null; // 这个组件不渲染任何内容
}