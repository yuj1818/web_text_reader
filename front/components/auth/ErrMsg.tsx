function ErrMsg({
  msg,
  color = 'text-red-500',
}: {
  msg: string;
  color?: string;
}) {
  return <span className={`text-xs ${color}`}>{msg}</span>;
}

export default ErrMsg;
