# Vite React Prerender

Vite で React コンポーネントをプリレンダリングするためのスクリプトです。

このスクリプトではビルドの段階で React コンポーネントをレンダリングし、 html に変換します。ボタンのクリックで表示が変わるなどのプリレンダリングできない箇所については、 react-dom/client の `hydrateRoot` を使い、プリレンダリングされた html に React コンポーネントをアタッチすることでクライアントサイドでレンダリングします。

これによりクライアントサイドでのレンダリングを最小化できます。

## 1. `npm install`

## 2. `npm run dev`

http://localhost:8000

React アプリケーションをつくり、ルート要素の id とレンダリング対象のコンポーネントを `common/config.js` に設定します。

`index.html`

```html
<h2>App1</h2>
<div id="app-1">
  <!-- ここに React アプリケーションがレンダリングされる -->
</div>
```

`src/App1.jsx`

```jsx
import Counter from './components/Counter';

const App1 = () => {
  return (
    <>
      <p>Hello, App1!</p>
      <Counter />
    </>
  );
};

export default App1;
```

`common/config.js`

```js
export const apps = [
  {
    id: 'app-1', // React アプリケーションのルート要素
    Content: App1, // レンダリング対象の React コンポーネント
  },
  // ...
];
```

開発時は react-dom/client の `createRoot` によりクライアントサイドで React コンポーネントがレンダリングされます。

`src/index.jsx`

```jsx
apps.forEach(({ id, Content }) => {
  const root = document.getElementById(id);

  import.meta.env.DEV
    ? createRoot(root).render(<Content />) // 開発時
    : hydrateRoot(root, <Content />);
});
```

## 3. `npm run build`

ビルド時は react-dom/server の `renderToString` によりローカル PC 上で React コンポーネントがレンダリングされ、 html 要素として書き出されます。

`scripts/render.jsx`

```jsx
export const render = () => {
  return apps.map(({ id, Content }) => ({
    id,
    content: renderToString(<Content />), // プリレンダリング
  }));
};
```

`dist/index.html`

```html
<h2>App1</h2>
<div id="app-1">
  <p>Hello, App1!</p>
  <button>
    You clicked me
    <!-- -->0<!-- -->
    times
  </button>
</div>
```

ボタンのクリックで表示が変わるような箇所はプリレンダリングできないため、 `<!-- -->0<!-- -->` のように書き出されます。

本番時は react-dom/client の `hydrateRoot` により上記の html に React アプリケーションがアタッチされ、プリレンダリングできない箇所がクライアントサイドでレンダリングされます。

`src/index.jsx`

```jsx
apps.forEach(({ id, Content }) => {
  const root = document.getElementById(id);

  import.meta.env.DEV
    ? createRoot(root).render(<Content />)
    : hydrateRoot(root, <Content />); // 本番時
});
```

## 4. `npm run preview`

http://localhost:8080
