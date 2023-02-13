export const Restaurant = ({ image_url, name, address, url, rating }) => {
  return (
    <div className="restaurant--wrapper">
      <img src={image_url} className="restaurant--img" />
      <div className="restaurant--content">
        <a className="restaurant--name" href={url} target="_blank">
          {name}
        </a>
        <div>{address.slice(2, address.length - 2)}</div>
        <div>Rating: {rating}</div>
      </div>
    </div>
  );
};
