interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  title: string;
  innerRef?: React.Ref<HTMLParagraphElement>;
}

const TodoCard = ({ title, innerRef }: Props) => {
  return <p style={{ margin: "50px" }} ref={innerRef}>{title}</p>;
};

export default TodoCard;
