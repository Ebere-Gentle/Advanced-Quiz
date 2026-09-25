export default function Panel({ as: Tag = 'section', className = '', children, ...rest }) {
  return <Tag className={`panel ${className}`.trim()} {...rest}>{children}</Tag>
}
