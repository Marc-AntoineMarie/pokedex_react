function ListePoke({ nom, element, image }) {
  return (
    <div>
      <img src={image} alt={nom} />
      <h3>{nom}</h3>
      <p>{element}</p>
    </div>
  );
}

export default ListePoke;
