resource "aws_instance" "my_instance" {
  ami           = "ami-053b0d53c279acc90" # AMI ID for Ubuntu 20.04 LTS (free tier)
  instance_type = "t2.micro"
  key_name               = "arquisis-ec2"
  vpc_security_group_ids = [aws_security_group.my_security_group.id]
}

resource "aws_eip" "my_eip" {
  instance = aws_instance.my_instance.id
}

resource "aws_eip_association" "my_eip_association" {
  instance_id   = aws_instance.my_instance.id
  allocation_id = aws_eip.my_eip.id
}

# Create a security group
resource "aws_security_group" "my_security_group" {
  name        = "my-security-group"
  description = "Security group for SSH access"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "elastic_ip" {
  value = aws_eip.my_eip.public_ip
}


resource "aws_api_gateway_rest_api" "api-gw" {
    name = "api-gw"
}

resource "aws_api_gateway_resource" "api-gw-resource" {
    rest_api_id = aws_api_gateway_rest_api.api-gw.id
    parent_id   = aws_api_gateway_rest_api.api-gw.root_resource_id
    path_part   = "api-gw-resource"
}

resource "aws_api_gateway_method" "api-gw-method" {
    rest_api_id   = aws_api_gateway_rest_api.api-gw.id
    resource_id   = aws_api_gateway_resource.api-gw-resource.id
    http_method   = "GET"
    authorization = "NONE"
}

resource "aws_api_gateway_integration" "api-gw-integration" {
    rest_api_id = aws_api_gateway_rest_api.api-gw.id
    resource_id = aws_api_gateway_resource.api-gw-resource.id
    http_method = aws_api_gateway_method.api-gw-method.http_method
    type        = "HTTP"
    uri = "http://${aws_instance.my_instance.private_ip}:stocks" 
}

output "api-gw-url" {
    value = aws_api_gateway_integration.api-gw-integration.uri
}