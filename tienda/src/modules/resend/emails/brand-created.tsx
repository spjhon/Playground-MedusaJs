import { Container, Heading, Html } from "@react-email/components"


type BrandPlacedEmailProps = {
  brand: {email: string}
}

function BrandCreatedEmailComponent({ brand }: BrandPlacedEmailProps) {
  

  return (
    <Html>
      <Heading>Se ha creado una nueva marca</Heading>
      {brand.email}, este es un email que debe de verse
      <Container>
      este es un container vacio
      </Container>
    </Html>
  )
}

export const brandCreatedEmail = (props: BrandPlacedEmailProps) => (
  <BrandCreatedEmailComponent {...props} />
)