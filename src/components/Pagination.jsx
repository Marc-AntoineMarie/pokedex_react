function Pagination({ page, onPrev, onNext, disablePrev, disableNext }) {
  return (
    <div>
      <button onClick={onPrev} disabled={disablePrev}>◀ Page précédente</button>
      - page {page} -
      <button onClick={onNext} disabled={disableNext}>Page suivante ▶</button>
    </div>
  )
}

export default Pagination
