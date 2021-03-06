﻿// DotNetNuke® - http://www.dnnsoftware.com
// Copyright (c) 2002-2016, DNN Corp.
// All Rights Reserved

using System.Runtime.Serialization;

namespace Dnn.PersonaBar.Users.Components.Contracts
{
    [DataContract]
    public class CreateUserContract
    {
        [DataMember(Name = "firstName")]
        public string FirstName { get; set; }

        [DataMember(Name = "lastName")]
        public string LastName { get; set; }

        [DataMember(Name = "email")]
        public string Email { get; set; }

        [DataMember(Name = "userName")]
        public string UserName { get; set; }

        [DataMember(Name = "password")]
        public string Password { get; set; }

        [DataMember(Name = "randomPassword")]
        public bool RandomPassword { get; set; }

        [DataMember(Name = "authorize")]
        public bool Authorize { get; set; }

        [DataMember(Name = "notify")]
        public bool Notify { get; set; }
    }
}