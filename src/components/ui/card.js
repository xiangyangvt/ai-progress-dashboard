export const Card = ({ children }) => <div className='rounded-xl shadow border'>{children}</div>;
export const CardContent = ({ children, className }) => <div className={className}>{children}</div>;