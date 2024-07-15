# 오버레이 조작하기

오버레이를 호출하기 위해서 [custom id를 사용](./custom-id)했거나 `overlay.open(...)`의 반환 값을 사용하는 경우, `overlay.open(...)`의 콜백 밖에서 오버레이를 조작할 수 있어요.

## overlay.close

특정 오버레이를 닫기 위해서는, `overlay.close(...)`에 `overlayId`를 제공하세요.

```tsx
overlay.close(overlayId);
```

## overlay.unmount

특정 오버레이를 Unmount 시키기 위해서는, `overlay.unmount(...)`에 `overlayId`를 제공하세요.

```tsx
overlay.unmount(overlayId);
```

## overlay.closeAll

열려 있는 모든 오버레이를 닫기 위해서는, `overlay.closeAll()` 을 사용하세요.

```tsx
overlay.closeAll();
```

## overlay.unmountAll

모든 오버레이를 Unmount 시키기 위해서는, `overlay.unmountAll()` 을 사용하세요.

```tsx
overlay.unmountAll();
```
