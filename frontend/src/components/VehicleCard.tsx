type VehicleCardProps = {
  name: string;
  brand: string;
  year: number;
};

function VehicleCard(props: VehicleCardProps) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Brand: {props.brand}</p>
      <p>Year: {props.year}</p>
    </div>
  );
}

export default VehicleCard;