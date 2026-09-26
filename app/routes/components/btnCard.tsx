import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router';

interface BtnCardProps {
  title: string;
  description: string;
  btnText: string;
  path: string;
}

export default function BtnCard({
  title,
  description,
  btnText,
  path,
}: BtnCardProps) {
  return (
    <Card className="btn-card">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Link to={path}>
          <Button variant="primary">{btnText}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
